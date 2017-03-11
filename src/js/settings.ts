/// <reference path="_reference.ts" />

namespace quiz {
    /**
     * Interface for question type, used in question text generation
     * 
     * @export
     * @interface IQuestionType
     */
    export interface IQuestionText {
        name: string;
        questionHeader: string;
        questionFooter: string;
    }

    export interface ICategory {
        fullName: string;
        path: string;
        questionTextName: string
    }

    export interface ICategorySet {
        categories: string[];
    }

    export class Settings {
        imagePath: string;
        questionText: {[questionText: string]: IQuestionText};
        categories: {[category: string]: ICategory};
        categorySets: {[categorySet: string]: ICategory};

        public getCategoriesFromSet(set: ICategorySet): ICategory[] {
            let categorySet: ICategory[];
            for (let category in this.categories) {
                
            }
            return categorySet
        }

        public static GetSettings(): Promise<Settings> {
            let promise = new Promise((resolve: Function, reject: Function) => {
                $.get('config/settings.json', '', (settingsJson) => {
                    resolve(settingsJson);
                })
                .fail(() => {
                    reject('Failed to load settings json.');
                });
            });
            return promise;
        }
    }
}
