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
        questionTextName: string,
        answerType: string,
        unit: string,
        choices: string[]
    }

    export interface ICategorySet {
        display: boolean;
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

        public getCategoryObjectFromSet(set: ICategorySet): {[category: string]: ICategory} {
            let categoryList: {[category: string]: ICategory} = {};
            for (var category in set.categories) {
                category = set.categories[category];
                if (category in this.categories) {
                    categoryList[category] = this.categories[category];
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
