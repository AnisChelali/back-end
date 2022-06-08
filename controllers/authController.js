const JWT = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("./../models/userModel");
const Code = require("./../models/codeModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");

const signToken = (id) => {
  return JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN * 60 * 60 * 1000,
  });
};

const createSendToken = (user, statusCode, res) => {
  let token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token: {
      id: token,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // //why it doesn't work ??????????
  // const code = +req.body.invitationCode;
  // const inviteCode = await Code.findOne({ invitationCode: code });
  // if (!inviteCode)
  if (req.body.invitationCode != "12345")
    return next(new appError("please provide a valid invitation code", 401));

  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new appError("please provide an username or password", 401));
  }

  const user = await User.findOne({ username });
  console.log(user.password);
  console.log(password);
  // .select('+password')
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new appError("incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new appError("u are not logged in , please login to get access", 401)
    );

  //Verification token if is invalid or expired
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  //check user if still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new appError("user belonging to this token is no longer exists", 401)
    );

  // 4) check user change password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError("User recently changed password, Please login again", 401)
    );
  }

  //Grant user access to protected route
  req.user = currentUser;
  next();
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  const filteredBody = { username: req.body.username, email: req.body.email };

  await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (
    !(await currentUser.comparePassword(
      req.body.currentPassword,
      currentUser.password
    ))
  )
    return next(new appError("Please insert your previous password", 401));

  currentUser.password = req.body.newPassword;
  currentUser.passwordConfirm = req.body.newPassword;
  await currentUser.save();

  res.status(200).json({
    status: "success",
    user: {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
    },
  });
});
