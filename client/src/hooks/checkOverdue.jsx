
export function isOverdue(dueDateString, dueTimeString){
    const dueDate = new Date(dueDateString);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if(dueDate < today) return true;
    

    const [time, meridiem] = dueTimeString.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;

    const dueDateTime = new Date(dueDateString);
    dueDateTime.setHours(h, m, 0, 0);
    
    const now = new Date();
    
    return now > dueDateTime;
}
/*
export function isOverdue(dueDateString){
    const dueDate = new Date(dueDateString);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
}*/