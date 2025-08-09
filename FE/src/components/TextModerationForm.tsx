import { useState } from "react";
import { Stack, Textarea, Group, Button } from "@mantine/core";

type Props = {
  loading?: boolean;
  onSubmit: (text: string) => void;
  onClearHistory?: () => void;
  hasHistory?: boolean;
};

export default function TextModerationForm({
  loading,
  onSubmit,
  onClearHistory,
  hasHistory,
}: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (value) onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Textarea
          label="Nhập bình luận cần kiểm duyệt"
          placeholder="VD: Bạn thật ngu ngốc..."
          autosize
          minRows={3}
          maxRows={6}
          radius="md"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <Group wrap="wrap" gap="sm">
          <Button type="submit" loading={loading} size="sm">
            Kiểm tra
          </Button>
          <Button variant="default" onClick={() => setText("")} size="sm">
            Xoá
          </Button>
          {hasHistory && (
            <Button variant="subtle" onClick={onClearHistory} size="sm">
              Xoá lịch sử
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
