export interface AddTaskProps {
    refreshData: () => void; 
    isChecked : boolean ; 
  }

export interface TaskProps {
    id: number;
    title: string;
    checked: boolean;
}