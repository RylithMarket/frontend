"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Text,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const colors = {
    success: { bg: "#7BFF29/25", color: "#34E748", subtle: "#94C88B" },
    error: { bg: "#FF4D29/25", color: "#E73434", subtle: "#C88F8B" },
    loading: { bg: "#FFC229/25", color: "#E7E434", subtle: "#C8BF8B" },
    info: { bg: "#606060/25", color: "#FFFFFF", subtle: "#929189" },
  };

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          const toastType = toast.type as keyof typeof colors;
          return (
            <Toast.Root
              bg={colors[toastType].bg}
              backdropFilter={"blur(43px)"}
              width={{ md: "sm" }}
              p={"4"}
              rounded={"3xl"}
              h={"fit"}
            >
              {toast.type === "loading" ? (
                <Spinner size="xl" color={colors[toastType].color} />
              ) : (
                <Toast.Indicator
                  boxSize={"12"}
                  color={colors[toastType].color}
                />
              )}
              <Stack gap="1" flex="1" maxWidth="100%">
                {toast.title && (
                  <Toast.Title color={colors[toastType].color} fontSize={"lg"} fontWeight={"semibold"}>
                    <Text as="span" textTransform="uppercase">
                      {toast.title}
                    </Text>
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description color={colors[toastType].subtle}>
                    {toast.description}
                  </Toast.Description>
                )}
              </Stack>
              {toast.action && (
                <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
              )}
              {toast.closable && <Toast.CloseTrigger p={"2"}/>}
            </Toast.Root>
          );
        }}
      </ChakraToaster>
    </Portal>
  );
};
