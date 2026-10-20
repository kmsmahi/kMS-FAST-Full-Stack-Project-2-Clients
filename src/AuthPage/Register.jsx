import { useForm } from "react-hook-form";
import UseAuth from "../Hooks/UseAuth";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleLogin from "./GoogleLogin";
const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
     const { registerUser} = UseAuth();
     const location=useLocation();
     const navigation=useNavigate();
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
   {errors.name?.type === 'required' && <p className='text-red-500'>Name is required.</p>}

   <label className="label">Photo</label>

                    <input type="file" {...register('photo', { required: true })} className="file-input" placeholder="Your Photo" />

                    {errors.name?.type === 'required' && <p className='text-red-500'>Photo is required.</p>}
   
  <label className="label">Email</label>
  <input type="email" {...register('email',{required:true})} className="input" placeholder="Email" />
   {errors.email?.type === 'required' && <p className='text-red-500'>Email is required.</p>}

  <label className="label">Password</label>
  <input type="password" {...register('password',{
    required:true,
    minLength:6,
    pattern:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
    })} 
    className="input" 
    placeholder="Password" />
    {
                        errors.password?.type === 'required' && <p className='text-red-500'>Password is required.</p>
                    }
                    {
                        errors.password?.type === 'minLength' && <p className='text-red-500'>
                            Password must be 6 characters or longer
                        </p>
                    }
                    {
                        errors.password?.type === 'pattern' && <p className='text-red-500'>Password must have at least one uppercase, at least one lowercase, at least one number, and at least one special characters</p>
                    }

  <button className="btn btn-neutral mt-4">Register</button>
</fieldset>
            <p>Already have an account?
                <Link 
                state={location.state}
                to='/login'
                className="text-blue-500 underline"
                >Login</Link>
            </p>
            
                </form>

                <h1 className="text-xl text-center">OR</h1>

                <button className="btn btn-wide items-center"><span><FcGoogle className="w-6 h-12" /></span>register with google</button>
            </div>
        </div>
        </div>
    );
};

export default Register;