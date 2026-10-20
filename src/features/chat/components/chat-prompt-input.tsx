import { ArrowUpIcon, FileTextIcon, PlusIcon, XIcon } from "lucide-react";
import * as React from "react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type AttachmentFile = {
  id: string;
  name: string;
};

export function ChatPromptInput() {
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<AttachmentFile[]>([]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setText("");
    setFiles([]);
  }

  function onAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected) {
      return;
    }

    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
      })),
    ]);
    event.target.value = "";
  }

  return (
    <div className="mx-auto w-full max-w-lg py-6">
      <form ref={formRef} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={onAttach}
        />
        <InputGroup>
          {files.length > 0 && (
            <InputGroupAddon align="block-start" className="flex-wrap">
              {files.map((file) => (
                <Attachment key={file.id} size="sm">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((item) => item.id !== file.id),
                        )
                      }
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </InputGroupAddon>
          )}
          <InputGroupTextarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ask the agent to change your code..."
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            className="p-3"
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <InputGroupButton
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Attach files"
              onClick={() => inputRef.current?.click()}
            >
              <PlusIcon />
            </InputGroupButton>

            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="rounded-full"
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}
