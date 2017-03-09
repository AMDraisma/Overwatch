/// <reference path="_reference.ts" />

namespace quiz {
    export interface ICategory {
        name: string;
        fullname: string;
        path: string;
    }

    export interface ICategorySet {
        name: string;
        categories: string[];
    }

    export interface ISettings {
        imagePath: string;

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