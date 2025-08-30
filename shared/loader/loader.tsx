import loaderimg from '@public/loader.svg';
import Image from 'next/image';
export const Loader=()=>{
    return <>
    <Image
    src={loaderimg} 
    style={{width:'30px',height:'30px',margin:'auto',display: 'block'}}
    alt='loading'
    />
    </>
}