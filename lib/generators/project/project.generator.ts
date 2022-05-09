import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper } from '../../common-helper';
import { textHelper } from '../../text-helper';
import {
    AssetFolderModels,
    CollectionModels,
    ContentTypeElements,
    ContentTypeModels,
    LanguageModels,
    ProjectModels,
    RoleModels,
    TaxonomyModels,
    WorkflowModels
} from '@kentico/kontent-management';
import { IGenerateResult } from '../../common-helper';
import { camelCasePropertyNameResolver } from '@kentico/kontent-delivery';

export class ProjectGenerator {
    generateProjectModel(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        assetFolders: AssetFolderModels.AssetFolder[];
        collections: CollectionModels.Collection[];
        roles: RoleModels.Role[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): IGenerateResult {
        const code = this.getProjectModelCode({
            projectInformation: data.projectInformation,
            types: data.types,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            languages: data.languages,
            taxonomies: data.taxonomies,
            workflows: data.workflows,
            assetFolders: data.assetFolders,
            collections: data.collections,
            roles: data.roles
        });

        this.createFileOnFs(code);

        return {
            filenames: [`./${this.getProjectModelFilename()}`]
        };
    }

    getAssetFoldersCount(folders: AssetFolderModels.AssetFolder[], count: number = 0): number {
        count += folders.length;

        for (const folder of folders) {
            if (folder.folders) {
                count = this.getAssetFoldersCount(folder.folders, count);
            }
        }

        return count;
    }

    private getProjectComment(projectInformation: ProjectModels.ProjectInformationModel): string {
        let comment: string = `Project name: ${projectInformation.name}`;

        comment += `\n* Environment: ${projectInformation.environment}`;
        comment += `\n* Project Id: ${projectInformation.id}`;

        return comment;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `/**`;

        comment += `\n* ${contentType.name}`;
        comment += `\n* Last modified: ${contentType.lastModified}`;
        comment += `\n*/`;

        return comment;
    }

    private getWorkflowComment(workflow: WorkflowModels.Workflow): string {
        let comment: string = `/**`;

        comment += `\n* ${workflow.name}`;
        comment += `\n* Archived step Id: ${workflow.archivedStep.id}`;
        comment += `\n* Published step Id: ${workflow.publishedStep.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getAssetFolderComment(assetFolder: AssetFolderModels.AssetFolder): string {
        let comment: string = `/**`;

        comment += `\n* ${assetFolder.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getLanguageComment(language: LanguageModels.LanguageModel): string {
        let comment: string = `/**`;

        comment += `\n* ${language.name}`;
        comment += `\n* Is Active: ${language.isActive ? 'true' : 'false'}`;
        comment += `\n* Is Default: ${language.isDefault}`;
        comment += `\n* Fallback language Id: ${language.fallbackLanguage?.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getElementComment(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let comment: string = `/**`;
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }

        comment += `\n*/`;

        return comment;
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `/**`;

        comment += `\n* ${taxonomy.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getCollectionComment(collection: CollectionModels.Collection): string {
        let comment: string = `/**`;

        comment += `\n* ${collection.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getRoleComment(role: RoleModels.Role): string {
        let comment: string = `/**`;

        comment += `\n* ${role.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getProjectModelCode(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        assetFolders: AssetFolderModels.AssetFolder[];
        collections: CollectionModels.Collection[];
        roles: RoleModels.Role[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${this.getProjectComment(data.projectInformation)}
*/
export const projectModel = {
    languages: {
        ${this.getProjectLanguages(data.languages)}
    },
    collections: {
        ${this.getCollections(data.collections)}
    },
    contentTypes: {
        ${this.getProjectContentTypes(data.types, data.taxonomies)}
    },
    taxonomies: {
        ${this.getProjectTaxonomies(data.taxonomies)}
    },
    workflows: {
        ${this.getProjectWorkflows(data.workflows)}
    },
    roles: {
        ${this.getRoles(data.roles)}
    },
    assetFolders: ${this.getAssetFolders(data.assetFolders)}
};
`;

        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    private getProjectLanguages(languages: LanguageModels.LanguageModel[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `\n`;
            code += `${this.getLanguageComment(language)}\n`;
            code += `${camelCasePropertyNameResolver('', language.codename)}: {
                codename: '${language.codename}',
                id: '${language.id}',
                externalId: ${this.getExternalIdValue(language.externalId)},
                name: '${commonHelper.escapeNameValue(language.name)}'}`;
            code += `${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getExternalIdValue(externalId?: string): string {
        if (!externalId) {
            return 'undefined';
        }
        return `'${externalId}'`;
    }

    private getProjectWorkflows(workflows: WorkflowModels.Workflow[]): string {
        let code: string = ``;
        for (let i = 0; i < workflows.length; i++) {
            const workflow = workflows[i];
            const isLast = i === workflows.length - 1;

            code += `\n`;
            code += `${this.getWorkflowComment(workflow)}\n`;
            code += `${workflow.codename}: {
                codename: '${workflow.codename}',
                id: '${workflow.id}',
                name: '${commonHelper.escapeNameValue(workflow.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getAssetFolders(assetFolders: AssetFolderModels.AssetFolder[]): string {
        let code: string = `{`;
        for (let i = 0; i < assetFolders.length; i++) {
            const assetFolder = assetFolders[i];
            const isLast = i === assetFolders.length - 1;

            code += `\n`;
            code += `${this.getAssetFolderComment(assetFolder)}\n`;
            code += `${camelCasePropertyNameResolver('', assetFolder.name)}: {
                id: '${assetFolder.id}',
                externalId: ${this.getExternalIdValue(assetFolder.externalId)},
                folders: ${this.getAssetFolders(assetFolder.folders)}}${!isLast ? ',\n' : ''}`;
        }

        code += '}';

        return code;
    }

    private getProjectContentTypes(
        contentTypes: ContentTypeModels.ContentType[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;

            code += `\n`;
            code += `${this.getContentTypeComment(contentType)}\n`;
            code += `${contentType.codename}: {
                codename: '${contentType.codename}',
                id: '${contentType.id}',
                externalId: ${this.getExternalIdValue(contentType.externalId)},
                name: '${commonHelper.escapeNameValue(contentType.name)}',
                elements: {${this.getProjectElements(contentType, taxonomies)}}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectElements(
        contentType: ContentTypeModels.ContentType,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = '';
        const elementsWithName = contentType.elements.filter((m) => (m as any)['name']);
        for (let i = 0; i < elementsWithName.length; i++) {
            const element = elementsWithName[i];
            const isLast = i === elementsWithName.length - 1;
            const name = (element as any)['name'];

            if (!name) {
                throw Error(`Element '${element.codename}' needs to have a name property`);
            }

            const isRequired = commonHelper.isElementRequired(element);

            code += `\n`;
            code += `${this.getElementComment(element, taxonomies)}\n`;
            code += `${element.codename}: {
                codename: '${element.codename}',
                id: '${element.id}',
                externalId: ${this.getExternalIdValue(element.external_id)},
                name: '${commonHelper.escapeNameValue(name)}',
                required: ${isRequired},
                type: '${element.type}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[]): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;

            code += `\n`;
            code += `${this.getTaxonomyComment(taxonomy)}\n`;
            code += `${taxonomy.codename}: {
                codename: '${taxonomy.codename}',
                id: '${taxonomy.id}',
                externalId: ${this.getExternalIdValue(taxonomy.externalId)},
                name: '${commonHelper.escapeNameValue(taxonomy.name)}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getCollections(collections: CollectionModels.Collection[]): string {
        let code: string = ``;
        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            const isLast = i === collections.length - 1;

            code += `\n`;
            code += `${this.getCollectionComment(collection)}\n`;
            code += `${collection.codename}: {
                codename: '${collection.codename}',
                id: '${collection.id}',
                name: '${commonHelper.escapeNameValue(collection.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getRoles(roles: RoleModels.Role[]): string {
        let code: string = ``;
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            const isLast = i === roles.length - 1;

            code += `\n`;
            code += `${this.getRoleComment(role)}\n`;
            code += `${camelCasePropertyNameResolver('', role.name)}: {
                codename: ${role.codename ? "'" + role.codename + "'" : undefined},
                id: '${role.id}',
                name: '${commonHelper.escapeNameValue(role.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomiesTerms(terms: TaxonomyModels.Taxonomy[]): string {
        if (terms.length === 0) {
            return `terms: {}`;
        }

        let code: string = `terms: {`;
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            const isLast = i === terms.length - 1;
            code += `${term.codename}: {
                codename: '${term.codename}',
                id: '${term.id}',
                externalId: ${this.getExternalIdValue(term.externalId)},
                name: '${commonHelper.escapeNameValue(term.name)}',
                ${this.getProjectTaxonomiesTerms(term.terms)}
            }${!isLast ? ',\n' : ''}`;
        }
        code += '}';

        return code;
    }

    private createFileOnFs(code: string): void {
        const classFileName = this.getProjectModelFilename();

        fs.writeFileSync('./' + classFileName, code);

        console.log(`\nProject structure '${yellow(classFileName)}'`);
    }

    private getProjectModelFilename(): string {
        return `_project.ts`;
    }
}

export const projectGenerator = new ProjectGenerator();
