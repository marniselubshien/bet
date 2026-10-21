"use client"
import {useRef,useState} from "react"
import {Pencil,X} from "lucide-react"
export function GameEditor({name,image,status,priority,visible,children}: {name:string;image:string;status:string;priority:number;visible:boolean;children:React.ReactNode}) {
 const dialog=useRef<HTMLDialogElement>(null)
 const [error,setError]=useState(false)
 return <>
 <div className="flex items-center gap-4 rounded-xl border bg-card p-3 sm:p-4">
  <img src={error ? '/games/dice.png' : image} onError={()=>setError(true)} alt={name} className="h-20 w-15 shrink-0 rounded-lg object-cover"/>
  <div className="min-w-0 flex-1"><h2 className="truncate text-base font-semibold">{name}</h2><div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className={`rounded-full px-2 py-1 ${status==='enabled' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted'}`}>{status}</span><span>Priority {priority}</span><span>· {visible ? 'Visible' : 'Hidden'}</span></div></div>
  <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted" onClick={()=>dialog.current?.showModal()}><Pencil size={14}/>Edit</button>
 </div>
 <dialog ref={dialog} className="m-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-2xl overflow-y-auto rounded-2xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
  <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-5 py-4"><div><h2 className="text-lg font-semibold">Edit {name}</h2><p className="text-xs text-muted-foreground">Appearance, availability and betting limits</p></div><button aria-label="Close editor" className="rounded p-2 hover:bg-muted" onClick={()=>dialog.current?.close()}><X size={20}/></button></div>
  <div className="p-5">{children}</div>
 </dialog>
 </>
}

export function EditForm({action,children}: {action:(form:FormData)=>Promise<void>;children:React.ReactNode;className?:string}) {
 const [saving,setSaving]=useState(false)
 const [message,setMessage]=useState("")
 const form=useRef<HTMLFormElement>(null)
 return <form ref={form} className="space-y-5" action={async data=>{setSaving(true);setMessage("");try {await action(data);form.current?.closest('dialog')?.close()}catch(e){setMessage(e instanceof Error ? e.message : 'Unable to save. Please try again.')}finally{setSaving(false)}}}>
 <fieldset disabled={saving} className="space-y-5 disabled:opacity-60">{children}</fieldset>
 {saving && <p role="status" className="text-sm text-muted-foreground">Saving settings…</p>}
 {message && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{message}</p>}
 </form>
}
