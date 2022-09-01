import { IContentItem, Elements } from '@kontent-ai/delivery-sdk';
import { Actor } from './actor';
import { ReleaseCategory } from '../taxonomies/releasecategory';

/**
 * Generated by '@kontent-ai/model-generator@5.4.1' at 'Thu, 01 Sep 2022 11:35:49 GMT'
 *
 * Movie
 * Id: b0c0f9c2-ffb6-4e62-bac9-34e14172dd8c
 * Codename: movie
 */
export type Movie = IContentItem<{
  /**
   * Title (text)
   * Required: false
   * Id: 3473187e-dc78-eff2-7099-f690f7042d4a
   * Codename: title
   */
  title: Elements.TextElement;

  /**
   * Plot (rich_text)
   * Required: false
   * Id: f7ee4f27-27fd-a19b-3c5c-102aae1c50ce
   * Codename: plot
   */
  plot: Elements.RichTextElement;

  /**
   * Released (date_time)
   * Required: false
   * Id: 5ccf4644-0d65-5d96-9a32-f4ea21974d51
   * Codename: released
   */
  released: Elements.DateTimeElement;

  /**
   * Length (number)
   * Required: false
   * Id: 7e8ecfab-a419-27ee-d8ec-8adb76fd007c
   * Codename: length
   */
  length: Elements.NumberElement;

  /**
   * Poster (asset)
   * Required: false
   * Id: a39a7237-9503-a1ae-8431-5b6cdb85ae9d
   * Codename: poster
   */
  poster: Elements.AssetsElement;

  /**
   * Category (multiple_choice)
   * Required: false
   * Id: 9821c252-6414-f549-c17f-cc171dd87713
   * Codename: category
   */
  category: Elements.MultipleChoiceElement;

  /**
   * Stars (modular_content)
   * Required: false
   * Id: aa26a55d-19f8-7501-fea3-b0d9b1eeac71
   * Codename: stars
   */
  stars: Elements.LinkedItemsElement<Actor>;

  /**
   * SeoName (url_slug)
   * Required: false
   * Id: 756cc91a-a090-60f9-a7f0-f505bfbe046c
   * Codename: seoname
   */
  seoname: Elements.UrlSlugElement;

  /**
   * ReleaseCategory (taxonomy)
   * Required: false
   * Id: 65f2fd44-1856-bc2b-17c2-decb0635e3d2
   * Codename: releasecategory
   */
  releasecategory: Elements.TaxonomyElement<ReleaseCategory>;
}>;
