import { Project, ProjectStatus } from '../models/project'

// Project State Management - Singleton class
type Listener<T> = (items: T[]) => void;

class State<T> {
  // can't be accessed from outside, but can be accessed by any class that inherits
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>){
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  // a list of functions that is called whenever something changes
  // Global list of projects
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor(){
    super();
  }

  static getInstance(){
    if(this.instance)
      return this.instance;
    
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number){
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    // pushes new project to the global array of projects
    this.projects.push(newProject);

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find(prj => prj.id === projectId)

    if(project && project.status !== newStatus){
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners(){
    // Apply a copy of the global projects array as a parameter to the list of functions that's inside the listeners array
    for(const listenerFn of this.listeners){
      listenerFn(this.projects.slice());
    }
  }
}

// Guarantees that we can have only one global object by the static function getInstance in the singleton class
export const projectState = ProjectState.getInstance();  