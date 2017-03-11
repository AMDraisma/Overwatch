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
        name: string;
        fullName: string;
        path: string;
        questionTextName: string
    }

    export interface ICategorySet {
        name: string;
        categories: string[];
    }

    export interface ISettings {
        imagePath: string;
        questionText: {[questionText: string]: IQuestionText};
        categories: ICategory[];
        categorySets: ICategorySet[];
    }

    export function getSettings(): Promise<ISettings> {
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
