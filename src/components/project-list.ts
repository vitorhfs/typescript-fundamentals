import Component from './base-components';
import { autobind } from '../decorators/autobind';
import { Project, ProjectStatus } from '../models/project';
import { DragTarget } from '../models/drag-drop-interfaces';
import { projectState } from '../state/project-state';
import { ProjectItem } from './project-item';

  // ProjectList Class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> 
  implements DragTarget{
  assignedProjects: Project[];
  
  constructor(private type: 'active' | 'finished'){
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent){
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      event.preventDefault();
      const listElement = this.element.querySelector('ul')!;
      listElement.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent){
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autobind
  dragLeaveHandler(_event: DragEvent){
    const listElement = this.element.querySelector('ul')!;

    listElement.classList.remove('droppable');
  }

  configure(){
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    // calling a function to render the list of projects
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        // separating the lists by status
        if(this.type === 'active'){
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      // overwriting the past projects rendered with the new projects
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
  
  renderContent(){
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects(){
    // listening in both lists
    const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

    // erases all the innerhtml before re-render
    listElement.innerHTML = '';

    // appending a new list item with title
    for (const prjItem of this.assignedProjects){
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}