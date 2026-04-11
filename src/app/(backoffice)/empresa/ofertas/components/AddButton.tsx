"use client";

import { useRouter } from "next/navigation";
import {Plus} from 'lucide-react'

export default function Button () {
    const router = useRouter();

    const createOfferForm = (): void => {
        router.push("/oferta-form");
    };

    return(
        <button className="bg-primary-container text-on-primary-fixed px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all justify-end"
        onClick={createOfferForm}>
        <span className="material-symbols-outlined">Plus</span>
            NUEVA OFERTA
        </button>
    )
}