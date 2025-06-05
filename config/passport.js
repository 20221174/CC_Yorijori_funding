const axios = require("axios");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// email을 usernameField로 사용한다고 명시
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        // 유저 서비스에 로그인 요청
        const response = await axios.post(
          "http://user:3000/user-api/user/login",
          {
            email,
            password,
          }
        );

        // 로그인 성공 (200 OK)
        const user = response.data;
        return done(null, user);
      } catch (error) {
        // 로그인 실패 (예: 401 Unauthorized)
        if (error.response && error.response.status === 401) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(error);
      }
    }
  )
);

// 세션 저장
passport.serializeUser(function (user, done) {
  done(null, user.userId); // userId 필드를 세션에 저장
});

// 세션 복원
passport.deserializeUser(async function (userId, done) {
  try {
    const response = await axios.get(
      `http://user:3000/user-api/user/${userId}`
    );
    if (
      response.status === 200 &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return done(null, response.data[0]); // 배열 첫 번째 요소만 넘김
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});
