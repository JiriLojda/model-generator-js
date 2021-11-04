import { IContentItem, Elements } from '@kentico/kontent-delivery';

/**
 * Generated by '@kentico/kontent-model-generator@4.0.0-0' at 'Thu, 04 Nov 2021 12:46:07 GMT'
 */
export type Movie = IContentItem<{
  title: Elements.TextElement;
  released: Elements.DateTimeElement;
  releasecategory: Elements.TaxonomyElement;
  seoname: Elements.UrlSlugElement;
  length: Elements.NumberElement;
  category: Elements.MultipleChoiceElement;
  poster: Elements.AssetsElement;
  stars: Elements.LinkedItemsElement<IContentItem>;
  plot: Elements.RichTextElement;
}>;
