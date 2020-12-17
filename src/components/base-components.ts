export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string, 
    hostElementId: string, 
    insertAtStart: boolean,
    newElementId?: string,
  ){
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedContent = document.importNode(this.templateElement.content, true);
    this.element = importedContent.firstElementChild as U;
    if(newElementId)
      this.element.id = newElementId; 

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean){
    this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element); // pushes to the end of the app element
  } 

  abstract configure (): void;
  abstract renderContent(): void;
}