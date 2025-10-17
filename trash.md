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
