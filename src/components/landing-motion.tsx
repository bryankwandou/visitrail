"use client";
import gsap from "gsap";
import { useLayoutEffect } from "react";
export function LandingMotion(){
  useLayoutEffect(()=>{const media=gsap.matchMedia();media.add("(prefers-reduced-motion: no-preference)",()=>{const context=gsap.context(()=>{const timeline=gsap.timeline({defaults:{ease:"power3.out"}});timeline.from(".topnav",{y:-20,opacity:0,duration:.7}).from(".hero-copy > *",{y:28,opacity:0,duration:.75,stagger:.09},"-=.35").from(".proof-card",{x:55,rotate:2,opacity:0,duration:1},"-=.85").from(".float-card",{scale:.86,opacity:0,duration:.55,stagger:.12},"-=.5");gsap.to(".radius",{scale:1.08,duration:1.8,repeat:-1,yoyo:true,ease:"sine.inOut"});gsap.to(".orb-one",{y:-18,x:8,duration:4.5,repeat:-1,yoyo:true,ease:"sine.inOut"});gsap.utils.toArray<HTMLElement>(".feature").forEach(card=>gsap.from(card,{scrollTrigger:undefined,y:40,opacity:0,duration:.7,ease:"power2.out",delay:Number(card.dataset.delay??0)}));},document.body);return()=>context.revert()});return()=>media.revert()},[]);return null;
}
