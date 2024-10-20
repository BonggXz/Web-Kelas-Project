import React, { useState } from "react"

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const toggleMenu1 = () => {
		setIsUserOpen(!isUserOpen)
	}

	return (
		<>
			{/* Mobile */}
			<div className="flex justify-between relative top-3 lg:hidden">
				<div className="w-10 h-10 rounded-full flex justify-center items-center" id="UserButton">
					<img src="/NavIcon.png" alt="" className="w-6 h-6" onClick={toggleMenu} />
				</div>
				<div className={`text-center text-white ${isMenuOpen ? "hidden" : ""}`}>
					<div className="text-[0.7rem]">Hi, visitor!</div>
					<div className="font-bold text-[1rem]">WELCOME</div>
				</div>

				<div
					className={`w-10 h-10 rounded-full flex justify-center items-center `}
					id="UserButton">
					<img src="/user.svg" alt="" className="" />
				</div>

				{isMenuOpen && (
					<div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMenu}></div>
				)}

				<div
					className={`fixed top-0 left-0 h-full w-64  shadow-lg transform transition-transform duration-300 ease-in-out ${
						isMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					id="IsiNavbar">
					<ul className="mt-8">
						<li className="mb-4">
							<a href="#" className="text-white opacity-80 text-lg font-bold">
								Home
							</a>
						</li>
						<li className="mb-4">
							<a href="#Gallery" className="text-white opacity-80 text-lg font-bold">
								Gallery
							</a>
						</li>
						<li>
							<a href="#Tabs" className="text-white opacity-80 text-lg font-bold">
								Structure & Schedule
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Dekstop */}
			<div className="flex justify-between relative top-4 hidden lg:flex">
				<div>
					<img src="/LogoMAN.png" className="w-10 h-10" alt="" />
				</div>
				<ul className="mt-2 flex gap-5 ">
					<li className="mb-4">
						<a href="#" className="text-white opacity-80 text-[1rem] font-semibold">
							Home
						</a>
					</li>
					<li className="mb-4">
						<a href="#Gallery" className="text-white opacity-80 text-[1rem] font-semibold">
							Gallery
						</a>
					</li>
					<li>
						<a href="#Tabs" className="text-white opacity-80 text-[1rem] font-semibold">
							Structure & Schedule
						</a>
					</li>
				</ul>
				<div
					className={`w-10 h-10 rounded-full flex justify-center items-center `}
					id="UserButton">
					<img src="/user.svg" alt="" className="" onClick={toggleMenu1}/>
				</div>
			</div>

			{isUserOpen && (
    <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMenu1}></div>
)}

<div
    className={`fixed top-4 right-2 bg-green-500 text-white shadow-lg rounded-lg p-4 w-64 transition-opacity duration-300 ease-in-out ${
        isUserOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
    }`}
    id="LoginDropdown">
    {/* Informasi Status Login */}
    <h2 className="text-lg font-bold opacity-8 mb-4">User Status</h2>

    {/* Tampilan jika sudah login */}
    <div>
        <p className="text-gray-200">Anda sudah login.</p>
        <button
            className="w-full bg-yellow-500 mt-4 p-2 rounded text-black font-bold hover:bg-yellow-600 transition">
            Logout
        </button>
    </div>

    {/* Tampilan jika belum login */}
    <div className="mt-6">
        <p className="text-gray-200">Anda belum login.</p>
        <a
            href="#"
            className="w-full bg-yellow-500 mt-4 p-2 rounded text-black font-bold block text-center hover:bg-yellow-600 transition">
            Login
        </a>
    </div>
</div>


		</>
	)
}

export default Navbar
