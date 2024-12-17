import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {data} from '../../data/BannerData';

const {width} = Dimensions.get('window');

const Banner = () => {
  if (!data) {
    return <Text>Data is not available</Text>; // Handle the case where data is undefined or null
  }

  return (
    <View style={{height: 130}}>
      {data?.length > 0 && (
        <Carousel
          loop
          width={width}
          height={300}
          autoPlay={true}
          data={data}
          scrollAnimationDuration={2000}
          renderItem={({item}) => (
            <Pressable onPress={() => alert(item._id)}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={{uri: item.imgUrl}}
                  style={{
                    width: width,
                    height: 130,
                    // borderColor: 'aqua',
                    // borderWidth: 1.5,
                  }}
                  resizeMode="stretch"
                  onError={e =>
                    console.log(`Image failed to load:`, e.nativeEvent.error)
                  }
                />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Banner;
