import { emit } from "process";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface useGet2faStateProp {
	setTwoFa: React.Dispatch<React.SetStateAction<boolean>>;
	toogle : any;
	ref : any
}
const useGet2faState = (prop: useGet2faStateProp) => {
	useEffect(() => {
		try {
			fetch("http://lghoul.ddns.net:3001/auth/is2fa", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => {
					if (!res.ok) {
						return 
					}
					return res.json();
				})
				.then((data: any) => {
					try {
						if (data.is2FA === true) {
							prop.setTwoFa(true);
							prop.ref.current.checked = true
							
						} else {
							prop.ref.current.checked = false
							prop.setTwoFa(false);
						}
					} catch (error) {}
				});
		} catch (error) {}
	}, [prop.setTwoFa]);
};
const useGetImage = (confirmTwoFa: any, setConfirmTwoFa: any, ref: any, TwoFa: any, toogle: any) => {
	useEffect(() => {
		try {
			if (!TwoFa && ref.current.checked  ) {
				fetch("http://lghoul.ddns.net:3001/auth/generateQrCode", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "image/png",
					},
				})
					.then(async (res) => {
						if (!res.ok) {
							return 
						}
						const blob = await res.blob();
						const url = URL.createObjectURL(blob);
						setConfirmTwoFa(url);
					})
					.then((data: any) => {
						try {
						} catch (error) {}
					});
			}
		} catch (error) {}
	}, [!TwoFa && ref.current.checked]);
};
const useDisable2fa = (disable: any, isDropdownOpen: any, ref: any, TwoFa: any, setTwoFa: any) => {
	useEffect(() => {
		try {
			if (TwoFa && !ref.current.checked  ) {
				fetch("http://lghoul.ddns.net:3001/auth/disable2fa", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				})
					.then(async (res) => {
						if (!res.ok) {
							// throw new Error("two factor error");
							toast.error("Two Factor disable")
							return null;
						}
						toast.success("Two Factor disable")
						setTwoFa(false);
						
					})
					.then((data: any) => {
						try {
						} catch (error) {}
					});
			}
		} catch (error) {}
	}, [TwoFa,ref.current.checked]);
};

interface FormData2fa {
	code: string;
}

const TwoFaBar = ({ toogle, setToggle }: { toogle: any; setToggle: any }) => {
	const ref: any = useRef(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [error , seterror] = useState<string | undefined>();
	const [disable , setdisable] = useState<boolean>();
	const [formData, setFormData] = useState<FormData2fa>({
		code: "",
	});
	const [TwoFa, setTwoFa] = useState(false);
	const [confirmTwoFa, setConfirmTwoFa] = useState<string | undefined>();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		seterror(undefined);
	};

	useDisable2fa(disable, isDropdownOpen, ref, TwoFa, setTwoFa);
	useGetImage(confirmTwoFa, setConfirmTwoFa, ref, TwoFa, toogle);
	useGet2faState({ setTwoFa , toogle, ref});
	useEffect(() => {}, []);
	const handleDropdownToggle = () => {
		
			if (!ref.current.checked && TwoFa)
				setdisable(true)
		seterror(undefined)
		if (toogle !== 3) {
			setIsDropdownOpen(true);
			setToggle(3);
			if (!ref.current.checked)
			ref.current.checked = true
	} else {
		setIsDropdownOpen(false);
		setToggle(-1);
	}
};


	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		try{

		 await fetch("http://lghoul.ddns.net:3001/auth/checkValidcode", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code : formData.code }),
			}).then((res) => {
				if (!res.ok)
				{
					seterror("erroor");
					return;
				}
				setTwoFa(true);
				toast.success("Two factor is activeted")
				seterror(undefined);
				
			}).catch(error => {}) ;
			
			
		} catch (error) {
			// console.error(error);
		}

	}

	return (
		<div
			className="relative transition-all duration-200 ease-in-out "
			style={{
				transform:
					toogle === 1 || toogle === 2
						? toogle === 2
							? "translateY(7rem)"
							: "translateY(15rem)"
						: "translateY(0)",
			}}
		>
			<div
				className="relative transition-all duration-200 ease-in-out    bg-transparent text-textColor w-full py-2 px-8
			rounded-md shadow-buttonShadow border-solid border-textColor border-2
			 w-[100%]  "
			>
				<h1 className="flex justify-center">Two factor authtontication</h1>
				<hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-2 dark:bg-black" />
				<div className="flex">
					<div className="w-1/3 flex justify-end ">disable</div>
					<div className="w-1/3 flex justify-center">
						<label htmlFor="check" className="relative  inline-flex items-center cursor-pointer">
							<input
								ref={ref}
								type="checkbox"
								id="check"
								className="sr-only peer "
								onClick={handleDropdownToggle}
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-white peer-focus:before:ring-yellow-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonColor "></div>
						</label>
					</div>
					<div className="w-1/3 flex justify-star ">Enable</div>
				</div>
			</div>
			{toogle === 3 && !TwoFa && ref.current.checked ? (
				<form action="POST" onSubmit={handleSubmit}>
					<div className="flex flex-col justify-center items-center ">
						<img className="mt-5 flex-1  w-1/2" src={confirmTwoFa} alt="" />
						<div>
							<input
								type="number"
								id="twoFacode"
								name="code"
								onChange={handleChange}
								className="mt-5 appearance-none bg-white text-textColor w-full py-2 px-8
							rounded-full shadow-buttonShadow border-solid border-textColor border-2
							w-[100%]   leading-tight focus:outline-none focus:shadow-outline"
								placeholder="number code"
							/>
						</div>
						{(error) ? (<div className="font-extrabold text-red-500 mt-1"> check code and try again!</div> ) : <></>}
						<button
							className="bg-buttonColor text-textColor w-full py-2 px-8
						rounded-full shadow-buttonShadow border-solid border-textColor border-2
						 w-[100%]  mt-4"
							// ... handle password change submission
						>
							valdition code
						</button>
					</div>
				</form>
			) : (
				<></>
			)}
		</div>
	);
};

export default TwoFaBar;
