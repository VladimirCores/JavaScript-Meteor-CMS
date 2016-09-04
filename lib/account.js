// onLogoutHook = function () {
//    Router.go('/');
// }

// onSubmitHook = function (error, state) {
//    if (!error) {
//       if (state === "signIn") {
//          Router.go('/');
//       }
//    }
// }

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
   //  onLogoutHook: onLogoutHook,
   //  onSubmitHook: onSubmitHook,
   //  preSignUpHook: myPreSubmitFunc,
   //  postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Регистрация",
          signIn: "Войти",
          forgotPwd: "Вы забыли ввести пароль",
      },
      title: {
         signIn: CMSSettings.public.cms.title,
         verifyEmail: "Подтвердите пароль",
         forgotPwd: "Восстановление пароля"
      },
      errors: {
            accountsCreationDisabled: "Создание аккаунта на клиенте запрещено",
            cannotRemoveService: "",
            loginForbidden: "Ошибка входа",
            mustBeLoggedIn: "Для это операции нужен доступ",
            pwdMismatch: "Пароль не указан",
            validationErrors: "Ошибки проверки"
        }
    }
});


AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

AccountsTemplates.addFields([
   {
      _id: "username",
      type: "text",
      required: true,
      minLength: 5,
      hasIcon: true,
      iconClass: "user",
      placeholder: "Имя вводить здесь",
      errStr: 'Обязательно ввести имя пользователя',
      displayName: "Имя пользователя"
   },
   {
      _id: 'password',
      type: 'password',
      required: true,
      minLength: 6,
      hasIcon: true,
      iconClass: "lock",
      placeholder: "Пароль вводить здесь",
      displayName: "Пароль"
   }
]);
