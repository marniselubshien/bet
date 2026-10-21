"use client"
import {useEffect, useRef, useState} from "react"
import { Search, Gamepad2, Activity, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import styles from "./casino-lobby.module.css"
export type CategoryId = "lobby" | "originals" | "slots" | "pasa-picks" | "mini-games" | "live-casino"
type Game = {slug:string;name:string;image:string;isPlayable:boolean}
export default function CasinoLobby({games}: {games:Game[];wins:unknown[]}) {
 const searchOpen = useSearchParams().get("search") === "1"
 const [slide,setSlide]=useState(0)
 const [paused,setPaused]=useState(false)
 const touch=useRef<number | null>(null)
 const slides=[{slug:"mines",title:"Uncover the extraordinary"},{slug:"dice",title:"Make your next move"},{slug:"limbo",title:"Aim high. Go higher."}]
 useEffect(()=>{if(paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>setSlide(i=>(i+1)%3),5000);return ()=>clearInterval(timer)},[paused])
 const move=(delta:number)=>setSlide(i=>(i+delta+3)%3)
 const [query,setQuery]=useState("")
 const filtered=games.filter(g=>g.name.toLowerCase().includes((searchOpen ? query : "").toLowerCase()))
 return <div className={styles.lobby}>
 <div className={styles.imageCarousel} aria-label="Featured games" aria-roledescription="carousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false)}} onTouchStart={e=>{touch.current=e.touches[0]!.clientX}} onTouchEnd={e=>{if(touch.current!==null){const distance=e.changedTouches[0]!.clientX-touch.current;if(Math.abs(distance)>40)move(distance<0?1:-1)}touch.current=null}}>
 <Link href={`/casino/games/${slides[slide % slides.length]!.slug}`}><img key={slide} src={`/banners/${slides[slide % slides.length]!.slug}.svg`} alt={slides[slide % slides.length]!.title}/></Link>
 <div className={styles.carouselBar}><div className={styles.dots}>{slides.map((s,i)=><button key={s.slug} aria-label={`Show ${s.slug}`} aria-pressed={slide===i} onClick={()=>setSlide(i)}/>)}</div><div className={styles.arrows}><button aria-label="Previous banner" onClick={()=>move(-1)}><ChevronLeft size={15}/></button><button aria-label="Next banner" onClick={()=>move(1)}><ChevronRight size={15}/></button></div></div>
 </div>
 {searchOpen && <section className={styles.searchPanel} aria-label="Game search"><div className={styles.searchPanelTitle}><h2>Search games</h2><Link href="/casino" onClick={()=>setQuery("")} aria-label="Close search">×</Link></div><label className={styles.search}><Search size={17}/><input autoFocus aria-label="Search games" placeholder="Find a game…" value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</label></section>}

 <section id="games" className={styles.section}><div className={styles.sectionTitle}><div><span className={styles.headingIcon}><Gamepad2 size={19}/></span><h2>Originals</h2><span>{filtered.length} games</span></div></div><div className={styles.grid}>{filtered.map((g,index)=><Link key={g.slug} href={`/casino/games/${g.slug}`} className={styles.card}><div className={styles.art}><img src={g.image} alt={g.name}/>{!g.isPlayable && <span className={styles.unavailable}>Unavailable</span>}</div><span className={styles.cardMeta} title={g.isPlayable ? "Demo player count" : undefined}>{g.isPlayable ? <><span className={styles.playerDot} aria-hidden="true"/><span>{(2261-index*173).toLocaleString("en-IN")} <span className={styles.playingLabel}>playing</span></span></> : "Currently unavailable"}</span></Link>)}</div>{!filtered.length && <p className={styles.note}>No games match your search.</p>}</section>
 <section className={styles.section}><div className={styles.sectionTitle}><div><span className={styles.liveIcon}><Activity size={19}/></span><h2>Live bets</h2></div></div><div className={styles.wins}><table><thead><tr><th>Game</th><th>Player</th><th>Bet</th></tr></thead><tbody>{games.slice(0,6).map((g,i)=><tr key={g.slug}><td><span className={styles.betGame}><img src={g.image} alt=""/>{g.name}</span></td><td>Player{8042+i*137}</td><td>₹{[100,50,200,25,500,80][i]}.00</td></tr>)}</tbody></table></div></section>
 <footer className={styles.footer}>© 2026 7X PASA</footer></div>
}
