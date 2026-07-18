import { Schema, model, models, Document, Types } from 'mongoose';

export interface AnswerSubdoc {
  fieldId: string;
  value: string | string[] | boolean;
}

export interface ResponseDocument extends Document {
  formId: Types.ObjectId;
  answers: AnswerSubdoc[];
  submittedAt: Date;
}

const AnswerSchema = new Schema<AnswerSubdoc>(
  {
    fieldId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const ResponseSchema = new Schema<ResponseDocument>({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true, index: true },
  answers: [AnswerSchema],
  submittedAt: { type: Date, default: Date.now },
});

export const ResponseModel = models.Response || model<ResponseDocument>('Response', ResponseSchema);
