"use client"
import { Eye, EyeClosed, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import style from '@styles/auth/form.module.scss'
export default function ChangePasswordForm() {
    const [showIcon, setShowIcon] = useState(false);
    const [inputPassType, setInputPassType] = useState('password');
    const router = useRouter()

    const switchPasswordIcon = (e: any) => {
        e.preventDefault();
        setInputPassType(p => p == 'password' ? 'text' : 'password')
        setShowIcon(p => !p)
    }

    const submit = (e: any) => {
        e.preventDefault();
        router.push('/ContactsReason')
    }
    return (
        <div className={style['auth-form']}>
            <form onSubmit={submit}>

                <div className={`${style['input-field']} ${style['password']}`}>
                    <i>

                    <Lock size={20} />
                    </i>

                    <input type={inputPassType} name="password" required placeholder='Password' />
                    <button className={style['showing-pass']} onClick={switchPasswordIcon}>
                        {!showIcon && <i><EyeClosed size={20} /></i>}
                        {showIcon && <i><Eye size={20} /></i>}
                    </button>
                </div>
                <div className={`${style['input-field']} ${style['password']}`}>
                    <i>

                    <Lock size={20} />
                    </i>

                    <input type={inputPassType} name="confirmPassword" required placeholder='Password' />
                    <button className={style['showing-pass']} onClick={switchPasswordIcon}>
                        {!showIcon && <i><EyeClosed size={20} /></i>}
                        {showIcon && <i><Eye size={20} /></i>}
                    </button>
                </div>
                <div className={style['submit-field']}>
                    <input type="submit" value="change Password" />
                </div>
            </form>
        </div>
    )
}