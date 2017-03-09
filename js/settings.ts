/// <reference path="_reference.ts" />

namespace quiz {
    interface ICategory {
        name: string;
        fullname: string;
        path: string;
    }

    interface ICategorySet {
        name: string;
        categories: string[];
    }

    export interface ISettings {
        imagePath: string;

        categories: ICategory[];
        categorySets: ICategorySet[];
    }

    function getSettings() {
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