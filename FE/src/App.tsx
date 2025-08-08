import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Container,
  Title,
  Stack,
  Textarea,
  Group,
  Button,
  Card,
  Badge,
  Text,
} from "@mantine/core";
import { moderateText, type ModerationResp } from "./libs/api";

export default function App() {
  const [text, setText] = useState("");
  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: (t: string) => moderateText(t),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) mutate(text);
  };

  const resp: ModerationResp | undefined = data;

  const hasDebug = resp?.debug !== undefined && resp?.debug !== null;

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        AI Comment Moderation
      </Title>

      <form onSubmit={onSubmit}>
        <Stack>
          <Textarea
            placeholder="Nhập bình luận…"
            autosize
            minRows={4}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <Group>
            <Button type="submit" loading={isPending}>
              Kiểm tra
            </Button>
            <Button variant="default" onClick={() => setText("")}>
              Clear
            </Button>
          </Group>
        </Stack>
      </form>

      {isError && (
        <Card withBorder mt="lg">
          <Text c="red">Lỗi: {(error as Error).message}</Text>
        </Card>
      )}

      {resp && (
        <Card withBorder mt="lg">
          <Group justify="space-between">
            <Text fw={600}>Kết quả</Text>
            <Badge color={resp.allowed ? "green" : "red"}>
              {resp.allowed ? "ALLOWED" : "BLOCKED"}
            </Badge>
          </Group>

          <Group mt="sm">
            {resp.reasons.length ? (
              resp.reasons.map((r) => <Badge key={r}>{r}</Badge>)
            ) : (
              <Badge variant="light">clean</Badge>
            )}
          </Group>

          {hasDebug ? (
            <>
              <Text size="sm" c="dimmed" mt="sm">
                Debug
              </Text>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(resp!.debug, null, 2)}
              </pre>
            </>
          ) : null}
        </Card>
      )}
    </Container>
  );
}
