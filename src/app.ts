// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}
  //   new 키워드 막음

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    // 있다면 원래 것 반환
    this.instance = new ProjectState();
    return this.instance;
    // 없다면 만듦
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  //   여기서 데이터 받음
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random.toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    // projects 배열에 객체 저장
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
      // 리스트에 보내기

      // 원본보호 복사
      // 복사
    }
  }
}

const projectState = ProjectState.getInstance();
// 하나의 인스턴스만 생성 가능~~~~!!

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// 유효성 검사 함수
// 재사용이 가능하게 함수로 작성
function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  //   0이더라도 확인
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}
// != 하나는 null 과 undifined 모두 포함

// autobind decorator
function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
// adjDescriptor이 origianl을 덮어씀

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement; // <section>
  assignedProjects: Project[];
  //   폼에 작성 받은 입력값 state에서 꺼내오기

  //  미완료시 active
  //  완료시 finished
  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // state에서 (입력받은)목록들 받아오기
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Active;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // <ul>

    listEl.innerHTML = '';
    // 지우고 다시 랜더링 새로운 변경만 렌더링 X

    // 할당 받은 값 for문 돌기
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  // render
  // h2
  // ul
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    // <ul> 파라미터로 받은 type 값으로 id 기입
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + 'PROJECTS';
    // <h2> 텍스트 넣기
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

// ProjectInput Class

// template 1 project-input
// template 2 single-project

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    //  <template id='project-input'>
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    //  <div id='app'>

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    // <template id='project-input'>{사이의 것들 가져오기}</template>

    // 깊은 복사를 할 것인지 말 것인지 결정
    // 요소 사이를 끌어 옴 props.children같은 것
    // .content === 사이의 것들

    this.element = importedNode.firstElementChild as HTMLFormElement;
    // <form>
    this.element.id = 'user-input';
    // <form id='user-input'>

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;
    // #id를 지칭함

    this.configure();
    this.attach();
  }

  //submit시 받은 사용자 값을 검사, 튜플 return
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    //1. 현재 값 받아오기

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    //2. 유효성 검사 기준 세우기

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invaild input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }

    //3. 검사에 따른 결과
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    // 검사가 완료된 튜플

    // => union 타입이라서 타입가드 필요!!!
    // Javascript
    // 오버로딩?? 타입가드??
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      // 데이터 보내고(싱글톤)
      this.clearInputs();
      // 창 지우기
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
    // html 삽입 메서드
    // <div>에 <form> 삽입

    // importedNode를 할당해야 하지만 생성자 함수에서만 사용할 수 있는 상수이고
    // 확실한 html 요소에 접근해야 함
  }
}

const proInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');

// 복제
// 필터링
