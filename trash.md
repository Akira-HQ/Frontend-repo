<div className='flex flex-col justify-center items-center w-[400px]'>
              <div className='flex justify-between  w-full gap-5'>
                <label className='flex flex-col '>
                  <span className='text-2xl text-white font-semibold'>Fullname</span>
                  <input type="text" required className='w-[300px] rounded-md bg-white h-8 mb-5 text-black px-2 outline-none' onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Email</span>
                  <input type="email" required className='w-[300px] rounded-md bg-white h-8 mb-5 text-black px-2 outline-none' onChange={(e) => setEmail(e.target.value)} />
                </label>
              </div>

              <div className="flex justify-center  w-full gap-5 mb-5 ml-5">
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Password</span>
                  <input type="password" required className='w-[300px] rounded-md bg-white h-8 text-black px-2 outline-none' onChange={handlePasswordChange} />

                </label>

                <label className="flex flex-col">
                  <span className='text-2xl text-white font-semibold'>Confirm Password</span>
                  <input type="password" required className='w-[300px] rounded-md bg-white h-8 text-black px-2 outline-none' onChange={handlePasswordChange} />
                </label>
              </div>
            </div>

// const NotificationItem = ({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) => {
// return (
// <div className={`w-fit rounded-lg shadow-md p-4 border border-gray-200 bg-[#0d0f12] transition-opacity duration-500 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
// <span className="text-green-600 bg-[#000] px-3 py-1 rounded-md">New</span>
// <div className="flex items-start gap-2 ">

// <div className="flex-shrink-0 mt-1">
// {getNotificationIcon(notification.type)}
// </div>

// <div className="flex-grow">
// <h3 className="font-semibold text-gray-800">
// {currentNotification.data.title}
// </h3>
// <p className="text-sm text-gray-600 mt-1"
// dangerouslySetInnerHTML={{
//               __html: currentNotification.data.message.replace('{value}', `<b>${(currentNotification.data as any).progress?.value || ''}</b>`)
//             }}
// />

// {currentNotification.type === 'USAGE_ALERT' && (
// <div className="mt-2">
// <div className="w-full bg-gray-200 rounded-full h-2">
// <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${currentNotification.data.progress.value}%` }}></div>
// </div>
// </div>
// )}

// {currentNotification.type === "SECURITY_TIP" && (
// <a href={notification.data.action.link}
// className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block"
// >
// {currentNotification.data.action.text}
// </a>
// )}
// </div>

// <button className="text-gray-400 hover:text-gray-600 flex-shrink-0"
// onClick={() => { onDismiss(notification.id) }}
// >
// <IoClose className="h-5 w-5" />
// </button>
// </div>
// </div>
// )
// }


//create akira account
router.post(
  "/user/signup",
  checkSchema(signupValidatorSchema),
  async (request, response) => {
    const { email, password, name, plan } = request.body;
    const result = validationResult(request);
    const validatedEmail = emailValidator(email);
    const validatedPassword = passwordValidator(password);
    const insert_query =
      "INSERT INTO users (id, name, email, password, plan) VALUES ($1, $2, $3, $4, $5)";
    const filter_query = "SELECT email FROM users WHERE email = $1";
    const insert_confirmation_query =
      "INSERT INTO confirmation_tokens (id, user_id, otp, email_to_confirm, created_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6)";
    const emailExists = await pool.query(filter_query, [email]);

    try {
      if (!result.isEmpty() || !validatedEmail) {
        return response.status(400).send({ message: "Invalid Credentials" });
      }

      if (emailExists.rows.length > 0) {
        return response.status(409).send({ message: "Email already exists" });
      }

      if (!name) {
        return response.status(400).send({ message: "Must provide name " });
      }

      if (!validatedPassword.valid) {
        return response.status(400).send({ error: validatedPassword.errors });
      }

      const newRequest = matchedData(request);
      newRequest.password = await hashPassword(password);
      const code = getConfirmationCode(newRequest.email);

      const userid = generateID(6);
      const subject = "Welcome! Confirm your account";
      const text = `Enter this code to confirm your account: ${code.otpCode}. This code expires in 2 minutes.`;
      const link = `https://akiraai.com/user?cc=${code.otpCode}`;
      const html = `<p>Click <a href="${link}">Here</a> to proceed to confirmation page </p>`;

      const mailSent = await sendMail(email, subject, text, html);

      if (!mailSent) {
        console.error("Failed to send confirmation email.");
      }
      const newUser = {
        id: userid,
        ...newRequest,
        plan: plan,
      };

      await pool.query(insert_query, [
        userid,
        newRequest.name,
        newRequest.email,
        newRequest.password,
        plan,
      ]);

      await pool.query(insert_confirmation_query, [
        code.otpId,
        userid,
        code.otpCode,
        code.email,
        code.expiresAt,
        code.createdAt,
      ]);

      const jsonToken = jwt.sign(
        {
          userID: user.id,
          email: user.email,
          plan: user.plan,
        },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      return response.status(201).send({
        message: "Account created. Check yout mail to confirm.",
        data: buildUserFeedback(newUser),
        token: jsonToken,
      });
    } catch (error) {
      console.error("An error occured", error);
      return response
        .status(500)
        .send({ message: "An error occured", error: error });
    }
  }
);