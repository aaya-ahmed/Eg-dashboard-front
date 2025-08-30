"use client"
import { Eye, EyeClosed, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import style from '@styles/auth/form.module.scss'
export default function ForgetPasswordForm() {
    const router = useRouter()
    const submit = (e: any) => {
        e.preventDefault();
        router.push('/changePassword')
    }
    return (
        <div className={style['auth-form']}>
            <form onSubmit={submit}>
                <div className={style['input-field']}>
                    <i><User size={20} /></i>
                    <input type="text" name="userName" required placeholder='User name' />
                </div>
                <div className={style['link']}>
                    <div>
                        <a href='/forgetPassword'> login</a>
                    </div>
                </div>
                <div className={style['submit-field']}>
                    <input type="submit" value="send code" />
                </div>
            </form>
        </div>
    )
}