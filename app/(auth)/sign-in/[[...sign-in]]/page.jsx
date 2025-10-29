import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url('images/sign-in-bg.png')",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Welcome to Mock.AI
              </h2>

              <p className="max-w-xl mt-3 text-gray-300">
                Level up your interview preparation with Mock.AI - your
                personal AI interview coach.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <img
                  className="w-auto h-26 sm:h-20"
                  src="images/logo.svg"
                  alt="Logo"
                />
              </div>

             
            </div>

            <div className="mt-8">
              <SignIn />
              

              <p className="mt-6 text-sm text-center text-gray-400">
                Don&apos;t have an account yet?{" "}
                <a
                  href="#"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Sign up
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) 

}