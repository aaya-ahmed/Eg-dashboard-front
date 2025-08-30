import { toast, type TypeOptions } from "react-toastify";
const customId = 'custom-id-yes';
// import 'react-toastify/dist/ReactToastify.min.css';// Import the CSS

export const Notification = ({title, type }: { title:string, type: TypeOptions }) => {
    toast(
        <div>
            <h5>{title}</h5>
        </div>,
        {
            type: type,
            position:'top-left',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: customId,
          },
    )
};