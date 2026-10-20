import { useForm } from "react-hook-form";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const registerBtnHandler=(data)=>{
        console.log('form data :',data);
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-sm">Login with KMS-FAST</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(registerBtnHandler)}>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  

  <label className="label">Email</label>
  <input type="email" {...register('email',{required:true})} className="input" placeholder="Email" />

  <label className="label">Password</label>
  <input type="password" {...register('password',{required:true})} className="input" placeholder="Password" />

  <button className="btn btn-neutral mt-4">Login</button>
</fieldset>
            
                </form>
            </div>
        </div>
    );
};

export default Login;