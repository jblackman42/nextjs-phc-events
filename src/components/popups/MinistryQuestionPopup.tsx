"use client";
import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { cn } from '@/lib/utils';
import { getQuestionInformation } from '@/app/actions';
import { HaQuestion } from '@/lib/types';

function MinistryQuestionPopup({ QuestionID }: { QuestionID: number | undefined }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [question, setQuestion] = useState<HaQuestion[]>([]);

  useEffect(() => {
    (async () => {
      if (QuestionID === undefined) return;
      setQuestion([]);
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const newQuestion = await getQuestionInformation(QuestionID);
      console.log(newQuestion);
      setLoading(false);
    })()
  }, [QuestionID]);



  return QuestionID !== undefined && <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Description
      </DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid custom-scroller overflow-auto">
      <h1>Hello world</h1>
    </div>
  </DialogContent>
}

export default MinistryQuestionPopup;