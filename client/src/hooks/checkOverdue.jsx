
export function isOverdue(dueDateString){
    const dueDate = new Date(dueDateString);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
}