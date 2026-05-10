import './styles/LandingPage.css';
import { Link } from 'react-router-dom'; // Links to 'SignIn.jsx'

function LandingPage() {


  return (
    
    <div className="bg-[#097204] overflow-hidden h-screen text-white">
      <div className="container-fluid min-h-screen flex justify-center items-center relative z-10 ">
        <div className="container max-w-4xl mx-auto text-left px-10">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-400">
            Trackr
          </h1>

          <p className="text-2xl md:text-3xl font-medium leading-tight">
            Calendar <br/>
            Tasks <br/>
            Notes <br />
            All in one Place
          </p>

          <p className="text-md md:text-xl text-gray-300 mt-4 max-w-2xl">
            With Trackr, students can plan their day, track accomplishments, and never miss a deadline, all in a clean, easy-to-use interface.
          </p>

          <Link to="/login" className="z-100 inline-block bg-yellow-400 text-xl text-black px-15 py-2 rounded-full mt-6 no-underline hover:bg-[#ecf147] active:bg-[#d4d800] font-medium hover:cursor-pointer">
            Continue
          </Link>

        </div>
      </div>
      <div className="ellipse bg-[#bdbdbd] "></div>
    </div>
    
  )
}

export default LandingPage
