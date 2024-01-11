import { useState } from "react";
import { toast } from "react-toastify";
import { ip } from "../network/ipaddr";

export const UploadTest = () => {
	const [file, setFile] = useState<File | null>(null);
  
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	const types = ["image/png","image/gif", "image/jpg" ,"image/jpeg"]
	  if (e.target.files) {
		if (!types.includes(e.target.files[0].type))
		{
			toast.error("Error: png, jpg or jpeg  are the accepted types")
			setFile(null)
			return
		}
		if (e.target.files[0].size > 5000000)
		{
			toast.error("ile bigger than 5Mb in size")
			setFile(null)
			return ;
		}
		setFile(e.target.files[0]);
	  }
	 
	};
	
	const handleUpload =  () => {
		if (!file)
		{
			toast.error("please chose  an image")
			return
		}
		console.log(file)
		var formdata = new FormData()
		formdata.append('IMAGE', file)
		console.log(formdata.get(""))
		fetch("http://" + ip + "3001/repository", { body:formdata, method:"POST", credentials: 'include'}).then(async res => {
			if (res.status < 400)
				{
					toast("image uploaded succesfully");
					return 
				}
			const ret = await res.json()
			toast.error(ret.message)
		})
	};
  
	return (

		<div className="flex gap-x-2">
            <label className="border-2 border-solid">
		        <input type="file" className="hidden"  onChange={handleFileChange} /> {file ? file.name : "upload a file"}
            </label>
            { file &&
            <div className="border-2 border-solid" onClick={handleUpload}>
                upload
            </div>
            }
		</div>

  

	);
  };