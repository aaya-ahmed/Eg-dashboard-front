type FormContainerProps = {
  isAdd: boolean;
  header:string
  children: [
    React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>,
    React.ReactElement<React.FormHTMLAttributes<HTMLFormElement>>
  ];
};

export default function FormContainer({ isAdd,header, children }: FormContainerProps) {
  const [returnButton, form] = children;
  
  return (
    <div className="form-container">
      <h3 className={isAdd ? "form-edit-header" : "form-add-header"}>
        <span>{header}</span>
        {returnButton}
      </h3>
      <div className="flex-row-form">
        {form}
      </div>
    </div>
  );
}
