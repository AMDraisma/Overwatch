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

    export interface ISettings {
        imagePath: string;
        questionText: {[questionText: string]: IQuestionText};
        categories: {[category: string]: ICategory};
        categorySets: {[categorySet: string]: ICategorySet};
    }

    export class Settings implements ISettings{
        imagePath: string;
        questionText: {[questionText: string]: IQuestionText};
        categories: {[category: string]: ICategory};
        categorySets: {[categorySet: string]: ICategorySet};

        public constructor(settings: ISettings) {
            Object.assign(this, settings);
        }

        public getCategoryListFromSet(set: ICategorySet): ICategory[] {
            let categoryList: ICategory[] = [];
            for (var category in set.categories) {
                category = set.categories[category];
                if (category in this.categories) {
                    categoryList.push(this.categories[category]);
                }
            }
            return categoryList;
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
