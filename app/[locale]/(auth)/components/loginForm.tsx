"use client"
import { Eye, EyeClosed, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import style from '@styles/auth/form.module.scss'
import { useForm } from "react-hook-form";
import LoginService from "../../../../services/login.service";
import { Loader } from "@shared/loader/loader";
import { useLocale } from "next-intl";
import { Notification } from "@shared/notification";
const service = new LoginService()
export default function LoginForm() {
    const [showIcon, setShowIcon] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputPassType, setInputPassType] = useState('password');
    const router = useRouter();
    const locale=useLocale()
    const { getValues, handleSubmit, register, formState: { errors } } =
        useForm<{ email: string, password: string }>({
            mode: 'all',
            defaultValues: {
                email: '',
                password: ''
            }
        })
    const switchPasswordIcon = (e: any) => {
        e.preventDefault();
        setInputPassType(p => p == 'password' ? 'text' : 'password')
        setShowIcon(p => !p)
    }
    const submit = (e: any) => {
        setIsSubmitted(true)
        service.login(getValues()).then(res => {

            router.push(`landing-page`)
        }).catch(e=>{
            console.log(e)
            Notification({
                title:locale=='ar'?'كلمه السر/ايميل غير صحيح':'email/password is not correct',
                type:'error'
            })
        setIsSubmitted(false)

        })
    }

    return (
        <div className={style['auth-form']}>
            <form onSubmit={handleSubmit(submit)}>
                <div className={`${style['input-field']}`}>
                    <label className={`${style['input-label']}`}>
                        <User size={20} />

                    </label>
                    <input type="text" placeholder='email' {...register('email', {
                        required: 'email is required'
                    })} />
                    {errors.email?.ref && <span className={`${style['invalid']}`}>{errors?.email?.message}</span>}

                </div>
                <div className={`${style['input-field']} ${style.password}`}>
                    <label className={`${style['input-label']}`}>
                        <Lock size={20} />

                    </label>
                      <input type={inputPassType} placeholder='Password'    {...register('password', {
                        required: 'password is required'
                    })} />

                    <button className={style['showing-pass']} onClick={switchPasswordIcon}>
                        {!showIcon && <i><EyeClosed size={20} /></i>}
                        {showIcon && <i><Eye size={20} /></i>}
                    </button>
                    {errors.password?.ref && <span className={`${style['invalid']}`}>{errors?.password?.message}</span>}

                </div>

                {/* <div className={style['links']}>
                    <div className={style['remeber']}>
                        <input type="checkbox" name="remeberMe" />
                        <label>Remeber me</label>
                    </div>
                    <div>
                        <a href='/forgetPassword'> Forget password?</a>
                    </div>
                </div> */}
                <div className={style['submit-field']}>
                    {!isSubmitted&&<input type="submit" value="login" disabled={isSubmitted} />}
                    {isSubmitted && <Loader />}
                </div>
            </form>
        </div>
    )
}