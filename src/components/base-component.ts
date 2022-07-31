//Component Base Class
// - 렌더링 기능
// 추상 클래스 인스턴스화를 막고 상속만 (extends).
// 상속에서 구현

export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
  templateElement: HTMLTemplateElement
  hostElement: T
  element: U

  // 동일
  // newElement?:string
  // newElement:string|undifined
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string //!! 필수 매개변수는 선택적 매개변수 다음에 올 수 없다.
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement
    this.hostElement = document.getElementById(hostElementId)! as T

    const importedNode = document.importNode(this.templateElement.content, true)

    this.element = importedNode.firstElementChild as U
    if (newElementId) {
      this.element.id = newElementId
    }

    this.attach(insertAtStart)
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    )
  }

  abstract configure?(): void
  abstract renderContent(): void
  // 구현내용과 구성은 상속단계에서 이뤄짐
  // 생성자 함수에 따라 해당 메소드가 좌우되기 때문에 동작이 달라질 수 있음.
}

// ProjectItem Class
