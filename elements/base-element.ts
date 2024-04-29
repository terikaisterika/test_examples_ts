import { Page , Locator, expect} from "@playwright/test"
import { allure } from "allure-playwright";
import { Input } from "./input";
/**
 * Базовый элемент определяет некоторые действия и требования
 * К примеру наследники должны дать имя элементу для allure
 */
export abstract class BaseElement {
  public WebElement:Locator;
  Locator:string;
  NameElement:string;
  /**
   * 
   * @param page страница, на которой происходит поиск
   * @param locator локатор для поиска
   * @param name наименование элемента, которое будет писаться в allure
   * желательно name делать по названию переменной
   */
  constructor(protected page: Page,locator:string, name:string){
    
    this.WebElement = page.locator(locator);
    this.Locator = locator;
    this.NameElement = name;
  }
  /**
   * Клик на текущем элементе
   * @param [forceValue=false] нужно ли игнорировать то, 
   * что кнопка не кликабельна.
   * forceValue=true подойдет, если надо проверить, что в режиме конструктора 
   * даже после нажатий на кнопки, расчетов нет.
   */
  async click(forceValue:boolean=false){
    await allure.step(`Клик на элемент с локатором: ${this.Locator}. Имя элемента: ${this.NameElement}`, 
    async ()=>{
      await this.WebElement.click({force: forceValue});
    })
  }
  /**
   * Проверка видимости элемента
   */
  async isVisible(){
    await allure.step(`Элемент с локатором ${this.Locator} должен быть видимым. Имя элемента: ${this.NameElement}`, 
    async ()=>{
      await expect(this.WebElement).toBeVisible();
    })
  }
  /**
   * Проверка, что элемент не видимый
   * если opacity больше 0, то элемент видимый.
   */
  async isHidden(){
    await allure.step(`Элемент с локатором ${this.Locator} должен быть скрыт. Имя элемента: ${this.NameElement}`, 
    async ()=>{
      await expect(this.WebElement).toBeHidden();
    })
  }
  /**
   * Двойнок клик
   */
  async dbclick(){
    await allure.step(`Двойной клик на элементе с локатором ${this.Locator}. Имя веб элемента: ${this.NameElement}`, 
    async ()=>{
      await this.WebElement.dblclick();
    })
  }
  /**
   * Для пененоса элемента с помощью hover down move up
   * @param canvas элемент, к которому нужно перенести текущий элемент
   */
  async dragAndDropTo(canvas:Locator){
    await allure.step(`Перенос элемента ${this.Locator} на canvas элемент. Имя переносимого элемента: ${this.NameElement}`, 
    async ()=>{
      const ecBox = await canvas.boundingBox();
      if (ecBox!==null){
      await this.WebElement.hover()
      await this.page.mouse.down();
    
      await this.page.mouse.move(ecBox.x + ecBox.width / 2, ecBox.y + ecBox.height/2);
      await this.page.mouse.move(ecBox.x + ecBox.width / 2, ecBox.y + ecBox.height/2);
      await this.page.mouse.up();
    }
    })
  }
  
  /**
   * Проверка текста
   * @param textExpected 
   */
  async checkText(textExpected:string|RegExp|null){ 
    await allure.step(`Сверка текста: ${textExpected} в элементе с локатором ${this.Locator}. Элемент: ${this.NameElement}`, async ()=>{
      if(textExpected === null) throw new Error('Текст для сравнения равен null')
      await expect(this.WebElement).toHaveText(textExpected)
    })
  }
  /**
   * Проверка, что высота clientHeight элемента больше 0
   */
  async checkClientHeight(){
    await allure.step(`Проверка clientHeight для элемента с локатором ${this.Locator}`, async ()=>{
      const locatorForSearch:string = this.Locator;
      const boolCondition = await this.page.evaluate(locatorForSearch=>{
      const button = document.querySelector(locatorForSearch);
      const result = button === null?false: button.clientHeight > 0;
      return result;
    }, locatorForSearch);
    expect(boolCondition, `ClientHeight элемента: ${this.NameElement} равна 0`).toBeTruthy();
    })
  }
  /**
   * Подходит для поиска после drag and drop или если данные динамические, 
   * к примеру, находим первый элемент и ищем в нем
   * к примеру,  в sidebar или canvasDiv
   * @param innerElement элемент, который должен находиться в текущем элементе
   */
  async getInnerElement(innerElement:Locator|string):Promise<Locator>{
      return await allure.step<Locator>(`Найти элемент внутри элемента ${this.NameElement}`, async():Promise<Locator>=>{
        return this.WebElement.locator(innerElement)
      })
  }
}

// export abstract class BaseElement {
//   public WebElement:Locator;
//   Locator:string;
//   NameElement:string;
//   constructor(protected page: Page|Locator,locator:string, name:string){
    
//     this.WebElement = page.locator(locator)
//     this.Locator = locator;
//     this.NameElement = name;
//   }
//   async click(){
//     await allure.step(`Клик на ${this.Locator}. Имя переменной: ${this.NameElement}`, 
//     async ()=>{
//       await this.WebElement.click();
//     })
//   }
  
//   async checkText(textExpected:string|RegExp|null){ 
//     await allure.step(`Сверка текста: ${textExpected} в элементе с локатором ${this.Locator}. Имя переменной:${this.NameElement}`, async ()=>{
//       if(textExpected === null) throw new Error('Текст для сравнения равен null')
//       await expect(this.WebElement).toHaveText(textExpected);
//     })
//   }

//   async checkClientHeight(page:Page){
//     await allure.step(`Проверка clientHeight для элемента с локатором ${this.Locator}`, async ()=>{
//       const locatorForSearch:string = this.Locator;
//       const boolCondition = await page.evaluate(locatorForSearch=>{
//       const button = document.querySelector(locatorForSearch);
//       const result = button === null?false: button.clientHeight > 0;
//       console.log('Terika result', locatorForSearch);
//       return result;
//     }, locatorForSearch);
//     expect(boolCondition).toBeTruthy();
//     })
//   }
  
//   // async getInnerElement(page:Page, locator:string){
//   //   await allure.step(`Get inner element from `, async ()=>{
//   //     this.WebElement.locator(locator);
//   //   });
//   // }
// }