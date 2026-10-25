'use client';
import Image from 'next/image';
import {useRef, useState} from 'react';
import type {Locale} from '@/lib/i18n';
type GalleryImage = {id: string; url: string; alt?: string | null};
export default function ProductGallery({images, name, locale = 'fr'}: {images: GalleryImage[]; name: string; locale?: Locale}) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = images[selected] ?? images[0];
  const ar = locale === 'ar';
  if (!current) return <div className="detail-gallery detail-gallery-empty">{ar ? 'الصورة قيد الإضافة' : 'Visuel à venir'}</div>;
  const move = (step: number) => setSelected(index => (index + step + images.length) % images.length);
  return <div className="detail-gallery">
    <button className="detail-main-image" type="button" onClick={() => dialog.current?.showModal()} aria-label={ar ? 'تكبير صورة المنتج' : 'Agrandir la photo du produit'}><Image src={current.url} alt={name} fill priority sizes="(max-width:900px) 100vw,55vw"/><span className="gallery-expand" aria-hidden>⤢</span></button>
    <div className="gallery-meta"><span>{ar ? 'صور المنتج' : 'Vues du produit'}</span><span>{selected + 1} / {images.length}</span></div>
    {images.length > 1 && <div className="thumbs" aria-label={ar ? 'اختر صورة المنتج' : 'Choisir une vue'}>{images.map((image,index) => <button key={image.id} type="button" className={`thumb-button ${index===selected ? 'is-selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={index===selected} aria-label={`${ar ? 'الصورة' : 'Photo'} ${index+1}`}><Image src={image.url} alt="" width={100} height={80}/></button>)}</div>}
    <dialog ref={dialog} className="gallery-dialog" aria-label={name} onClick={event => {if(event.target === event.currentTarget) dialog.current?.close();}} onKeyDown={event => {if(event.key==='ArrowRight') move(ar ? -1 : 1); if(event.key==='ArrowLeft') move(ar ? 1 : -1);}}>
      <button className="gallery-close" type="button" onClick={() => dialog.current?.close()} aria-label={ar ? 'إغلاق' : 'Fermer'} autoFocus>×</button>
      <div className="lightbox-image"><Image src={current.url} alt={name} fill sizes="90vw"/></div>
      <div className="lightbox-controls"><button type="button" onClick={() => move(-1)} disabled={images.length===1}>{ar ? 'السابق' : 'Précédent'}</button><span>{selected+1} / {images.length}</span><button type="button" onClick={() => move(1)} disabled={images.length===1}>{ar ? 'التالي' : 'Suivant'}</button></div>
    </dialog>
  </div>;
}
