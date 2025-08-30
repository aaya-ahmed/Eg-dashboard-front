type momentprop={
    date:Date
}
export const Moment=({date}:momentprop)=>{
    return<>
    <span>{date?date.toLocaleDateString().substring(0,10):'-'}</span>
    </>
}