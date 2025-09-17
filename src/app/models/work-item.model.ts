export interface WorkItem{
    id: string;
}  

export interface MaterialWorkItem extends WorkItem {
  profile: string;
  length: string;
  location: string;
}

export interface AssemblyWorkItem extends WorkItem {
  mark: string;
  description: string;
  drawing: string;
}