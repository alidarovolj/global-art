export function useIntersectionObserver(
    callback,
    options = {root: null, threshold: 0},
) {
    const elementRef = ref(null);
    const isVisible = ref(true);

    let observer;

    const handleIntersection = (entries) => {
        entries.forEach((entry) => {
            isVisible.value = entry.isIntersecting;
            callback(isVisible.value);
        });
    };

    onMounted(() => {
        observer = new IntersectionObserver(handleIntersection, options);

        if (elementRef.value) {
            observer.observe(elementRef.value);
        }
    });

    onUnmounted(() => {
        if (observer && elementRef.value) {
            observer.unobserve(elementRef.value);
        }
    });

    return {elementRef, isVisible};
}
