import { useForm } from "react-hook-form";
import UseAuth from "../Hooks/UseAuth";
const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
     const { registerUser} = UseAuth();
    const registerBtnHandler=(data)=>{
        console.log('form data :',data);
        registerUser(data.email,data.password)
        .then((result)=>{
            console.log(result.user);
        })
        .catch((err)=>{
            console.log(err);
        })
        
    }

    return (
        <div>
            <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-sm">Register with KMS-FAST</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(registerBtnHandler)}>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

   <label className="label">Name</label>
  <input type="text" {...register('name',{required:true})} className="input" placeholder="Enter your name" />
  
   
  <label className="label">Email</label>
  <input type="email" {...register('email',{required:true})} className="input" placeholder="Email" />

  <label className="label">Password</label>
  <input type="password" {...register('password',{required:true})} className="input" placeholder="Password" />

  <button className="btn btn-neutral mt-4">Register</button>
</fieldset>
            
                </form>
            </div>
        </div>
        </div>
    );
};

export default Register;