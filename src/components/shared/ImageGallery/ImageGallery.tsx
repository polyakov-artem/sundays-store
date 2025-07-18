import { FC, memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { MEDIA_CONTAIN, MEDIA_COVER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import Button from '../Button/Button';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { TIntrinsicDiv } from '../../../types/types';
import './ImageGallery.scss';

export const IMAGE_GALLERY = 'image-gallery';
export const IMAGE_GALLERY_VIEWPORT_WRAP = `${IMAGE_GALLERY}__viewport-wrap`;
export const IMAGE_GALLERY_BTN = `${IMAGE_GALLERY}__btn`;
export const IMAGE_GALLERY_BTN_NEXT = `${IMAGE_GALLERY}__btn-next`;
export const IMAGE_GALLERY_BTN_PREV = `${IMAGE_GALLERY}__btn-prev`;
export const IMAGE_GALLERY_SLIDES_VIEWPORT = `${IMAGE_GALLERY}__slides-viewport`;
export const IMAGE_GALLERY_SLIDES = `${IMAGE_GALLERY}__slides`;
export const IMAGE_GALLERY_SLIDE = `${IMAGE_GALLERY}__slide`;
export const IMAGE_GALLERY_THUMBNAILS_VIEWPORT = `${IMAGE_GALLERY}__thumbnails-viewport`;
export const IMAGE_GALLERY_THUMBNAILS = `${IMAGE_GALLERY}__thumbnails`;
export const IMAGE_GALLERY_THUMBNAIL = `${IMAGE_GALLERY}__thumbnail`;
export const IMAGE_GALLERY_THUMBNAIL_SELECTED = `${IMAGE_GALLERY_THUMBNAIL}_selected`;

export type TSource = {
  originalUrl: string;
  thumbnailUrl: string;
};

export type TImageGalleryProps = {
  sources: TSource[];
  options?: EmblaOptionsType;
} & TIntrinsicDiv;

const defaultOptions = {};

const ImageGallery: FC<TImageGalleryProps> = (props) => {
  const { sources, options, ...rest } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ ...defaultOptions, ...options });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const handleThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },

    [emblaMainApi, emblaThumbsApi]
  );

  const handleBtnPrevClick = useCallback(() => {
    emblaMainApi?.scrollPrev();
  }, [emblaMainApi]);

  const handleBtnNextClick = useCallback(() => {
    emblaMainApi?.scrollNext();
  }, [emblaMainApi]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;

    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const sliderItems = useMemo(() => {
    const thumbnails: ReactNode[] = [];
    const slides: ReactNode[] = [];

    sources.forEach(({ originalUrl, thumbnailUrl }, index) => {
      slides.push(
        <div key={originalUrl} className={IMAGE_GALLERY_SLIDE}>
          <img src={originalUrl} alt="" className={MEDIA_CONTAIN} />
        </div>
      );

      thumbnails.push(
        <button
          key={thumbnailUrl}
          onClick={() => handleThumbClick(index)}
          className={classNames(IMAGE_GALLERY_THUMBNAIL, {
            [IMAGE_GALLERY_THUMBNAIL_SELECTED]: index === selectedIndex,
          })}>
          <img src={thumbnailUrl} alt="" className={MEDIA_COVER} />
        </button>
      );
    });

    return { slides, thumbnails };
  }, [sources, handleThumbClick, selectedIndex]);

  const { slides, thumbnails } = sliderItems;

  return (
    <div className={IMAGE_GALLERY} {...rest}>
      <div className={IMAGE_GALLERY_VIEWPORT_WRAP}>
        <Button
          className={classNames(IMAGE_GALLERY_BTN, IMAGE_GALLERY_BTN_PREV)}
          view="round"
          theme="primary"
          el="button"
          onClick={handleBtnPrevClick}
          icon={<BsChevronLeft />}
        />
        <Button
          className={classNames(IMAGE_GALLERY_BTN, IMAGE_GALLERY_BTN_NEXT)}
          view="round"
          theme="primary"
          el="button"
          onClick={handleBtnNextClick}
          icon={<BsChevronRight />}
        />
        <div className={IMAGE_GALLERY_SLIDES_VIEWPORT} ref={emblaMainRef}>
          <div className={IMAGE_GALLERY_SLIDES}>{slides}</div>
        </div>
      </div>

      <div className={IMAGE_GALLERY_THUMBNAILS_VIEWPORT} ref={emblaThumbsRef}>
        <div className={IMAGE_GALLERY_THUMBNAILS}>{thumbnails}</div>
      </div>
    </div>
  );
};

export default memo(ImageGallery);
